import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { ICanvas, ICmp, ICmpWithKey, IEditStoreState } from "./editStoretyps";
import { getOnlyKey } from "src/utils";
import Axios from "src/api/axios";
import { getCanvasByIdEnd, saveCanvasEnd } from "src/api/api";
import { removeZoom } from "../zoomStore/zoomStore";
import { recordCanvasChangeHistory } from "./historySlice";
import { cloneDeep } from "lodash";

const useEditStore = create(
    immer<IEditStoreState>(() => ({
        canvas: getDefaultCanvas(),
        assembly: new Set(),
        canvasChangeHistory: [
            { canvas: getDefaultCanvas(), assembly: new Set() },
        ],
        canvasChangeHistoryIndex: 0,
    }))
);
// * 单个组件修改层级
// 置顶组件
export const topZIndex = () => {
    useEditStore.setState((draft) => {
        const cmps = draft.canvas.cmps;
        const selectCmpIndex = selectedCmpIndexSelector(draft);
        // 判断是不是最后一个组件
        const indexIsLast = selectCmpIndex === cmps.length - 1;
        if (indexIsLast) return;
        draft.canvas.cmps = cmps
            .slice(0, selectCmpIndex)
            .concat(cmps.slice(selectCmpIndex + 1))
            .concat(cmps[selectCmpIndex]);

        draft.assembly = new Set([cmps.length - 1]);
        recordCanvasChangeHistory(draft);
    });
};
// 置底组件
export const bottomZIndex = () => {
    useEditStore.setState((draft) => {
        const cmps = draft.canvas.cmps;
        const selectCmpIndex = selectedCmpIndexSelector(draft);
        // 判断是不是第一个组件
        const indexIsFirst = selectCmpIndex === 0;
        if (indexIsFirst) return;
        draft.canvas.cmps = [cmps[selectCmpIndex]]
            .concat(cmps.slice(0, selectCmpIndex))
            .concat(cmps.slice(selectCmpIndex + 1));

        draft.assembly = new Set([0]);
        recordCanvasChangeHistory(draft);
    });
};
// 上移一层
export const upZIndex = () => {
    useEditStore.setState((draft) => {
        const cmps = draft.canvas.cmps;
        const selectCmpIndex = selectedCmpIndexSelector(draft);
        const indexIsLast = selectCmpIndex === cmps.length - 1;
        if (indexIsLast) return;
        [
            draft.canvas.cmps[selectCmpIndex],
            draft.canvas.cmps[selectCmpIndex + 1],
        ] = [
            draft.canvas.cmps[selectCmpIndex + 1],
            draft.canvas.cmps[selectCmpIndex],
        ];

        draft.assembly = new Set([selectCmpIndex + 1]);
        recordCanvasChangeHistory(draft);
    });
};
// 下移一层
export const downZIndex = () => {
    useEditStore.setState((draft) => {
        const selectCmpIndex = selectedCmpIndexSelector(draft);

        const indexIsFirst = selectCmpIndex === 0;
        if (indexIsFirst) return;
        [
            draft.canvas.cmps[selectCmpIndex],
            draft.canvas.cmps[selectCmpIndex - 1],
        ] = [
            draft.canvas.cmps[selectCmpIndex - 1],
            draft.canvas.cmps[selectCmpIndex],
        ];

        draft.assembly = new Set([selectCmpIndex - 1]);
        recordCanvasChangeHistory(draft);
    });
};
// 复制组件
export const addAssemblyCmps = () => {
    useEditStore.setState((draft) => {
        const cmps = draft.canvas.cmps;
        const newCmps: Array<ICmpWithKey> = [];
        const newAssembly = new Set<number>();
        let i = draft.canvas.cmps.length;

        draft.assembly.forEach((index) => {
            const cmp = draft.canvas.cmps[index];
            const newCmp = cloneDeep(cmp);
            newCmp.key = getOnlyKey();

            newCmp.style.left += 40;
            newCmp.style.top += 40;

            newCmps.push(newCmp);
            newAssembly.add(i++);
        });
        cmps.push(...newCmps);
        draft.assembly = newAssembly;
    });
};
// 修改单个组件的style +
export const updateSelectedCmpStyle = (newStyle: any) => {
    useEditStore.setState((draft) => {
        const cmp = draft.canvas.cmps[Array.from(draft.assembly)[0]];
        Object.assign(cmp.style, newStyle);
        recordCanvasChangeHistory(draft);
    });
};
// 修改单个组件的属性 +
export const updateSelectedCmpAttr = (name: string, value: string) => {
    useEditStore.setState((draft) => {
        const selecetedCmpIndex = Array.from(draft.assembly)[0];
        const cmp = draft.canvas.cmps[selecetedCmpIndex];
        cmp[name] = value;
        recordCanvasChangeHistory(draft);
    });
};
// 修改选中组件style +
export const editAssemblyStyle = (newStyle: any) => {
    useEditStore.setState((draft) => {
        const canvasStyle = draft.canvas.style;
        draft.assembly.forEach((index) => {
            const cmpStyle = draft.canvas.cmps[index].style;
            if (newStyle.right === 0) {
                cmpStyle.left = canvasStyle.width - cmpStyle.width;
            } else if (newStyle.bottom === 0) {
                cmpStyle.top = canvasStyle.height - cmpStyle.height;
            } else if (newStyle.left === "center") {
                cmpStyle.left = (canvasStyle.width - cmpStyle.width) / 2;
            } else if (newStyle.top === "center") {
                cmpStyle.top = (canvasStyle.height - cmpStyle.height) / 2;
            } else {
                Object.assign(cmpStyle, newStyle);
            }
            draft.canvas.cmps[index].style = cmpStyle;
        });
        recordCanvasChangeHistory(draft);
    });
};
// 修改画布title +
export const updateCanvasTitle = (_title: string) => {
    useEditStore.setState((draft) => {
        draft.canvas.title = _title;
        recordCanvasChangeHistory(draft);
    });
};
// 修改画布style +
export const updateCanvasStyle = (_style: any) => {
    useEditStore.setState((draft) => {
        draft.canvas.style = { ...draft.canvas.style, ..._style };
        recordCanvasChangeHistory(draft);
    });
};
// 增加画布组件 +
export const addCmp = (cmp: ICmp) => {
    useEditStore.setState((draft) => {
        draft.canvas.cmps.push({ ...cmp, key: getOnlyKey() });
        draft.assembly = new Set([draft.canvas.cmps.length - 1]);
        recordCanvasChangeHistory(draft);
    });
};
// 保存画布内容
export const saveCanvas = async (
    id: number | null,
    type: string,
    successCallback: (id: number) => void
) => {
    const res: any = await Axios.post(saveCanvasEnd, {
        id,
        type,
        content: JSON.stringify(useEditStore.getState().canvas),
        title: useEditStore.getState().canvas.title,
    });
    successCallback(res?.id);
};
//读取画布内容
export const getCanvas = async (id: number) => {
    const res: any = await Axios.get(getCanvasByIdEnd + id);
    if (res) {
        useEditStore.setState((draft) => {
            draft.canvas = JSON.parse(res.content);
            draft.canvas.title = res.title;
        });
        removeZoom();
    }
};
//清空画布内容 +
export const clearCanvas = () => {
    useEditStore.setState((draft) => {
        draft.canvas = getDefaultCanvas();
        draft.assembly.clear();
        recordCanvasChangeHistory(draft);
    });
    removeZoom();
};
// 全选组件
export const selectAllCmps = () => {
    useEditStore.setState((draft) => {
        draft.assembly = new Set(
            Array.from({ length: draft.canvas.cmps.length }, (a, b) => b)
        );
    });
};
// 多选组件
export const selectSomeCmps = (indexArr: number[]) => {
    useEditStore.setState((draft) => {
        if (indexArr)
            indexArr.forEach((index) => {
                if (draft.assembly.has(index)) {
                    draft.assembly.delete(index);
                } else {
                    draft.assembly.add(index);
                }
            });
    });
};
// 选中一个组件
export const selectOneCmp = (index: number) => {
    useEditStore.setState((draft) => {
        if (index === -1) {
            draft.assembly.clear();
        } else {
            draft.assembly = new Set([index]);
        }
    });
};
// 修改组件属性（位置/伸缩）
export const updateAssemblyCmpsByDistance = (newStyle: any) => {
    useEditStore.setState((draft) => {
        draft.assembly.forEach((index) => {
            const cmp = { ...draft.canvas.cmps[index] };
            let invaild = false;
            for (const key in newStyle) {
                if (
                    (key === "width" || key === "height") &&
                    cmp.style[key] + newStyle[key] < 2
                ) {
                    invaild = true;
                    break;
                }
                cmp.style[key] += newStyle[key];
            }
            if (!invaild) draft.canvas.cmps[index] = cmp;
        });
    });
};
// 储存拖拽/拉伸的记录
export const recordCanvasChangeHistoryForDis = () => {
    const store = useEditStore.getState();
    if (
        store.canvas ===
        store.canvasChangeHistory[store.canvasChangeHistoryIndex].canvas
    )
        return;
    useEditStore.setState((draft) => {
        recordCanvasChangeHistory(draft);
    });
};
// 删除选中组件
export const delSelectedCmps = () => {
    useEditStore.setState((draft) => {
        const assembly = draft.assembly;
        draft.canvas.cmps = draft.canvas.cmps.filter(
            (_, index) => !assembly.has(index)
        );
        draft.assembly.clear();
        recordCanvasChangeHistory(draft);
    });
};
// 返回所选单个组件的下标
export const selectedCmpIndexSelector = (store: IEditStoreState) => {
    const selectedCmpIndex = Array.from(store.assembly)[0];
    return selectedCmpIndex === undefined ? -1 : selectedCmpIndex;
};
export default useEditStore;

export function getDefaultCanvas(): ICanvas {
    return {
        title: "未命名",
        // 页面样式
        style: {
            width: 320,
            height: 568,
            backgroundColor: "#ffffff",
            backgroundImage: "",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
        },
        // 组件
        cmps: [],
    };
}

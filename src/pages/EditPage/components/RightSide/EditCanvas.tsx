import {
    updateCanvasStyle,
    updateCanvasTitle,
} from "src/store/editStore/editStore";
import InputColor from "src/lib/InputColor";
import Item from "src/lib/Item";
import type { ICanvas } from "src/store/editStore/editStoretyps";
import styles from "./edit.module.less";

export default function EditCanvas({ canvas }: { canvas: ICanvas }) {
    const style = canvas.style;

    const handleStyleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        { name, value }: { name: string; value: number | string }
    ) => {
        updateCanvasStyle({ [name]: value });
    };

    return (
        <div className={styles.main}>
            <div className={styles.title}>画布属性</div>
            <Item label="标题">
                <input
                    type="text"
                    className={styles.itemRight}
                    value={canvas.title}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        updateCanvasTitle(newValue);
                    }}
                />
            </Item>

            <Item label="画布宽度">
                <input
                    type="number"
                    className={styles.itemRight}
                    value={style.width}
                    placeholder="px"
                    onChange={(e) => {
                        handleStyleChange(e, {
                            name: "width",
                            value: parseInt(e.target.value) - 0,
                        });
                    }}
                />
            </Item>

            <Item label="画布高度">
                <input
                    type="number"
                    className={styles.itemRight}
                    value={style.height}
                    placeholder="px"
                    onChange={(e) => {
                        handleStyleChange(e, {
                            name: "height",
                            value: parseInt(e.target.value) - 0,
                        });
                    }}
                />
            </Item>

            <Item label="背景颜色">
                <InputColor
                    className={styles.itemRight}
                    color={style.backgroundColor}
                    onChangeComplete={(e: any) => {
                        handleStyleChange(e, {
                            name: "backgroundColor",
                            value: `rgba(${e.r},${e.g},${e.b},${e.a})`,
                        });
                    }}
                />
            </Item>

            <Item label="背景图片">
                <input
                    type="text"
                    className={styles.itemRight}
                    value={style.backgroundImage}
                    onChange={(e) => {
                        handleStyleChange(e, {
                            name: "backgroundImage",
                            value: e.target.value,
                        });
                    }}
                />
            </Item>
        </div>
    );
}

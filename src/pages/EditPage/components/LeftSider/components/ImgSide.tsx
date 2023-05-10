import { defaultComponentStyle } from "src/utils/const";
import { isImgComponent } from "src/utils";
import useEditStore from "src/store/editStore/editStore";

const defaultStyle = {
    ...defaultComponentStyle,
};

const url = "https://www.bubucuo.cn/";

const settings = [
    {
        value: url + "react-head.png",
        style: defaultStyle,
    },

    {
        value: url + "bg1.png",
        style: defaultStyle,
    },
    {
        value: url + "bg2.png",
        style: defaultStyle,
    },
    {
        value: url + "blue-star.png",
        style: defaultStyle,
    },
    {
        value: url + "yellow-star.png",
        style: defaultStyle,
    },
    {
        value: url + "book.png",
        style: defaultStyle,
    },

    {
        value: url + "dancer.png",
        style: defaultStyle,
    },
    {
        value: url + "girl.png",
        style: defaultStyle,
    },
    {
        value: url + "red-girl.png",
        style: defaultStyle,
    },
    {
        value: url + "icon.png",
        style: defaultStyle,
    },

    {
        value: url + "lock.png",
        style: defaultStyle,
    },

    {
        value: url + "tree.png",
        style: defaultStyle,
    },

    {
        value: url + "certificate.jpg",
        style: defaultStyle,
    },
    {
        value: url + "chuliu.jpeg",
        style: defaultStyle,
    },
    {
        value: url + "tiger.png",
        style: defaultStyle,
    },
    {
        value: url + "hua.png",
        style: defaultStyle,
    },

    {
        value: url + "balance.png",
        style: defaultStyle,
    },
    {
        value: url + "balloon_ribbon.png",
        style: defaultStyle,
    },
    {
        value: url + "ball.png",
        style: defaultStyle,
    },

    {
        value: url + "bird_flower.png",
        style: defaultStyle,
    },

    {
        value: url + "board.png",
        style: defaultStyle,
    },

    {
        value: url + "bowknot.png",
        style: defaultStyle,
    },

    {
        value: url + "cloud.png",
        style: defaultStyle,
    },
    {
        value: url + "color_line.png",
        style: defaultStyle,
    },

    {
        value: url + "deer.png",
        style: defaultStyle,
    },
    {
        value: url + "figure.png",
        style: defaultStyle,
    },
    {
        value: url + "fire_bird.png",
        style: defaultStyle,
    },
    {
        value: url + "flower.jpg",
        style: defaultStyle,
    },
    {
        value: url + "flower.png",
        style: defaultStyle,
    },
    {
        value: url + "fu.png",
        style: defaultStyle,
    },
    {
        value: url + "gaoshaoyun.png",
        style: defaultStyle,
    },
    {
        value: url + "generate.gif",
        style: defaultStyle,
    },

    {
        value: url + "gold-coins2.png",
        style: defaultStyle,
    },
    {
        value: url + "gold-coins.png",
        style: defaultStyle,
    },
    {
        value: url + "go.png",
        style: defaultStyle,
    },
    {
        value: url + "heart.png",
        style: defaultStyle,
    },
    {
        value: url + "hua-bg.png",
        style: defaultStyle,
    },

    {
        value: url + "meng.webp",
        style: defaultStyle,
    },
    {
        value: url + "newyear.png",
        style: defaultStyle,
    },
    {
        value: url + "OMG.png",
        style: defaultStyle,
    },
    {
        value: url + "paper_plane.png",
        style: defaultStyle,
    },
    {
        value: url + "peony.jpg",
        style: defaultStyle,
    },
    {
        value: url + "pink_ball.png",
        style: defaultStyle,
    },
    {
        value: url + "pink_flower.png",
        style: defaultStyle,
    },
    {
        value: url + "plank.png",
        style: defaultStyle,
    },
    {
        value: url + "rainbow1.png",
        style: defaultStyle,
    },
    {
        value: url + "rainbow.png",
        style: defaultStyle,
    },

    {
        value: url + "red_flower.png",
        style: defaultStyle,
    },

    {
        value: url + "red-rose.jpg",
        style: defaultStyle,
    },

    {
        value: url + "ribbon.png",
        style: defaultStyle,
    },
    {
        value: url + "rinbbon1.png",
        style: defaultStyle,
    },
    {
        value: url + "rose.jpg",
        style: defaultStyle,
    },
    {
        value: url + "sale.png",
        style: defaultStyle,
    },
    {
        value: url + "star1.png",
        style: defaultStyle,
    },
    {
        value: url + "star.png",
        style: defaultStyle,
    },
    {
        value: url + "sun.png",
        style: defaultStyle,
    },
    {
        value: url + "taohuayun.png",
        style: defaultStyle,
    },
    {
        value: url + "technoiogy.png",
        style: defaultStyle,
    },
];

// 前端算法实战
const arithmetic = [
    "金九银十",
    "前端算法实战-buy.webp",
    "前端算法实战-title",
    "前端算法实战",
    "balloon-1",
    "balloon-2",
    "balloon-green",
    "cloud",
    "fairytale.webp",
    "five-balls",
    "flower",
    "girl-balloon",
    "green-learning",
    "heart-balloon",
    "prince",
    "red-flower",
    "ribbons",
    "up",
    "wing",
];

arithmetic.forEach((item) => {
    settings.push({
        value: `https://commom.pek3b.qingstor.com/all/arithmetic/${
            item.indexOf(".") > 0 ? item : item + ".png"
        }`,
        style: defaultStyle,
    });
});

export default function ImgSide() {
    const addCmp = useEditStore((state) => state.addCmp);
    console.log("TextSide render");

    const onDragStart = (e: React.DragEvent<HTMLLIElement>, item) => {
        e.dataTransfer.setData("drag-cmp", JSON.stringify(item));
        console.log(item);
    };
    return (
        <div className="top-0 left-20 h-full px-4 pt-3 pb-16 overflow-scroll shadow-sm bg-white">
            <ul className="w-64 flex justify-between flex-wrap gap-3">
                {settings.map((item) => (
                    <li
                        draggable={true}
                        key={item.value}
                        onClick={() =>
                            addCmp({ ...item, type: isImgComponent })
                        }
                        onDragStart={(e) =>
                            onDragStart(e, { ...item, type: isImgComponent })
                        }
                        className="flex justify-center items-center rounded-md w-28 h-28 overflow-hidden border-slate-100 border border-solid text-center
              hover:font-bold hover:text-blue-300 hover:border-blue-300"
                    >
                        <img
                            src={item.value}
                            className="w-full h-full"
                            draggable={false}
                            alt=""
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

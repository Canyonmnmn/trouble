import { Button, Card, Divider, Space, Table, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCanvasByIdEnd, getCanvasListEnd } from "src/api/api";
import Axios from "src/api/axios";
import useUserStore from "src/store/userStore/userStore";

interface ListItem {
    id: number;
    type: string;
    title: string;
    content: string;
}
const { confirm } = Modal;

export default function ListPage() {
    const [list, setList] = useState([]);
    const isLogin = useUserStore((state) => state.isLogin);
    const fresh = async () => {
        if (!isLogin) {
            return;
        }
        const res: any = await Axios.get(getCanvasListEnd);
        const data = res?.content || [];
        setList(data);
    };

    useEffect(() => {
        fresh();
    }, []);

    const editUrl = (item: ListItem) => `/?id=${item.id}&type=${item.type}`;
    const columns = [
        {
            title: "id",
            key: "id",
            align: "center",
            width: 300,
            render: (item: ListItem) => {
                return <Link to={editUrl(item)}>{item.id}</Link>;
            },
        },
        {
            title: "标题",
            key: "title",
            align: "center",
            width: 300,
            render: (item: ListItem) => {
                const title = item.title || "未命名";
                return <Link to={editUrl(item)}>{title}</Link>;
            },
        },

        {
            title: "类型",
            key: "type",
            align: "center",
            width: 300,
            render: (item: ListItem) => {
                const typeDesc = item.type === "content" ? "页面" : "模板页";
                return <div className="red">{typeDesc}</div>;
            },
        },

        {
            title: "动作",
            key: "action",
            align: "center",
            render: (item: ListItem) => {
                const { id } = item;
                return (
                    <Space size="middle">
                        <a
                            target="_blank"
                            href={"https://builder-lemon.vercel.app/?id=" + id}
                        >
                            线上查看（切移动端）
                        </a>

                        <Link to={editUrl(item)}>编辑</Link>
                        <Button onClick={() => del({ id })}>删除</Button>
                    </Space>
                );
            },
        },
    ];
    const del = (id: number) => {
        confirm({
            title: "删除",
            content: "您确认要删除吗，一旦删除之后将无法恢复",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk: async () => {
                await Axios.post(deleteCanvasByIdEnd, id);
                message.success("删除成功");
                fresh();
            },
        });
    };
    return (
        <Card>
            <Link to="/" className="text-red-600">
                新增
            </Link>
            <Divider />

            <Table
                size="large"
                rowKey={(record: ListItem) => record.id}
                dataSource={list}
                columns={columns}
            />
        </Card>
    );
}

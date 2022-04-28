/* https://leetcode-cn.com/problems/minesweeper/
让我们一起来玩扫雷游戏！

给你一个大小为 m x n 二维字符矩阵 board ，表示扫雷游戏的盘面，其中：

'M' 代表一个 未挖出的 地雷，
'E' 代表一个 未挖出的 空方块，
'B' 代表没有相邻（上，下，左，右，和所有4个对角线）地雷的 已挖出的 空白方块，
数字（'1' 到 '8'）表示有多少地雷与这块 已挖出的 方块相邻，
'X' 则表示一个 已挖出的 地雷。
给你一个整数数组 click ，其中 click = [clickr, clickc] 表示在所有 未挖出的 方块（'M' 或者 'E'）中的下一个点击位置（clickr 是行下标，clickc 是列下标）。

根据以下规则，返回相应位置被点击后对应的盘面：

如果一个地雷（'M'）被挖出，游戏就结束了- 把它改为 'X' 。
如果一个 没有相邻地雷 的空方块（'E'）被挖出，修改它为（'B'），并且所有和其相邻的 未挖出 方块都应该被递归地揭露。
如果一个 至少与一个地雷相邻 的空方块（'E'）被挖出，修改它为数字（'1' 到 '8' ），表示相邻地雷的数量。
如果在此次点击中，若无更多方块可被揭露，则返回盘面。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/minesweeper
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。*/

const board = [
    ["E", "E", "E", "E", "E"],
    ["E", "E", "M", "E", "E"],
    ["E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E"]
];
const click = [3, 0]
// const board = [["B", "1", "E", "1", "B"], ["B", "1", "M", "1", "B"], ["B", "1", "1", "1", "B"], ["B", "B", "B", "B", "B"]],
//     click = [3, 0]

// 获取相邻的元素
const getNeighbors = ([a, b]) => {
    const [R, L, D, U] = [
        b !== board[a].length - 1 ? b + 1 : -1,
        b - 1,
        a !== board.length - 1 ? a + 1 : -1,
        a - 1]
    let boomLength = 0; //计算炸弹数量

    [a, U, D].forEach(
        (x, key) => {
            if (x < 0) return
            [b, L, R].forEach((y, index) => {
                if (y < 0 || index === 0 && key === 0) return
                if (board[x][y] === 'M') {
                    boomLength++
                }
            })
        }
    )
    //如果周围没有炸弹则展开递归附近所有没有炸弹的空格子
    if (boomLength === 0) {
        board[a][b] = 'B';
        [a, U, D].forEach(
            (x, key) => {
                if (x < 0) return
                [b, L, R].forEach((y, index) => {
                    if (y < 0 || index === 0 && key === 0 || board[x][y] !== 'E') return
                    clickMethod([x, y])
                })
            }
        )
    } else {
        board[a][b] = boomLength.toString()
    }
}

const clickMethod = ([a, b]) => {
    switch (board[a][b]) {
        case 'E':
            getNeighbors([a, b])
            break;
        case 'M':
            board[a][b] = 'X'
            break;
        default:
    }
}
clickMethod(click);
//上面是自己写的
//下面的别人写的
const updateBoard = (board, click) => {
    const m = board.length;
    const n = board[0].length;
    const dx = [1, 1, 1, -1, -1, -1, 0, 0];// 右右右左左左正正
    const dy = [1, 0, -1, 0, 1, -1, 1, -1];// 下正上正下上下上
    const inBound = (x, y) => x >= 0 && x < m && y >= 0 && y < n; // 辅助函数

    const update = (x, y) => {
        if (!inBound(x, y) || board[x][y] !== 'E') return; // 不在界内或不是E，直接返回
        let count = 0;
        for (let i = 0; i < 8; i++) { // 统计周围雷的个数
            const nX = x + dx[i];
            const nY = y + dy[i];
            if (inBound(nX, nY) && board[nX][nY] === 'M') {
                count++;
            }
        }
        if (count === 0) { // 如果周围没有雷，标记B，递归周围的点
            board[x][y] = 'B';
            for (let i = 0; i < 8; i++) {
                update(x + dx[i], y + dy[i]);
            }
        } else {
            board[x][y] = count.toString();
        }
    };

    const [cX, cY] = click;
    if (board[cX][cY] === 'M') { // 第一下就踩雷了
        board[cX][cY] = 'X';
    } else {
        update(cX, cY); // 开启dfs
    }
    return board;
};

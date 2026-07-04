# 古诗词抽取智能体

随机抽查古诗默写工具。基于 Electron + React 构建，界面精美可定制。

## 功能特点

- **随机抽取**：从古诗库中随机选一首诗
- **随机出题**：随机选择某个联句的上句或下句作为题目
- **实时评分**：自动判断正误，统计得分率
- **可调界面**：自由切换颜色主题、字号、字体
- **可扩展诗库**：编辑 `src/data/poems.json` 即可增删改古诗

## 快速启动

### 方式一：直接运行（推荐）

双击 `启动古诗词抽取智能体.bat`

### 方式二：从源代码运行

```bash
npm install
npm run electron:preview
```

### 方式三：开发模式（带热更新）

```bash
npm run electron:dev
```

或双击 `dev-start.bat`

## 构建安装包

```bash
npm run electron:build
```

或双击 `build-exe.bat`

构建产物在 `release/` 目录下。

## 使用说明

1. 启动后，自动随机选一首诗，随机空出上句或下句
2. 在输入框中填写答案，按 Enter 或点击「提交答案」
3. 正确自动跳下一题；错误可查看正确答案
4. 点击右上角 ⚙ 打开设置面板：
   - 切换颜色主题（淡紫/浅粉/天蓝/薄荷/暖橙/灰蓝）
   - 调节字号（14px~36px）
   - 切换字体（微软雅黑/楷体/宋体/仿宋/黑体/华文行楷）
5. 按 Enter 快速提交或进入下一题

## 自定义古诗库

编辑 `src/data/poems.json`，格式如下：

```json
{
  "id": 1,
  "title": "诗名",
  "author": "作者",
  "couplets": [
    ["上句，", "下句。"],
    ...
  ],
  "note": "备注"
}
```

修改后需重新构建（`npx vite build`）或使用开发模式运行。

## 技术栈

- Electron 43
- React 19
- Vite 8
- electron-packager

# jiajun-shen.github.io

这是沈家骏个人网站的静态版本，可以直接发布到 GitHub Pages。

## 页面结构

- `index.html`：首页，放个人定位、精选项目和最近想做的方向。
- `projects.html`：项目/作品页，放机器人、仿真、硬件和创作项目。
- `writing.html`：文章/思考列表。
- `posts/robotics-systems.html`：第一篇文章示例，以后可以复制这个文件写新文章。
- `about.html`：关于我，放教育、实习、技能和兴趣。
- `assets/styles.css`：所有页面的样式。
- `assets/profile.jpeg`：头像图片，来自简历附件。

## 怎么修改

1. 改文字：打开对应的 `.html` 文件，找到中文注释附近的内容直接改。
2. 改颜色/间距/字体：打开 `assets/styles.css`。
3. 加项目：在 `projects.html` 里复制一个 `<article class="project-card">...</article>`，修改标题、时间、说明和标签。
4. 加文章：复制 `posts/robotics-systems.html`，改文件名、标题和正文，再到 `writing.html` 加一张文章卡片链接过去。
5. 换头像：把新头像放到 `assets/`，然后把页面里的 `assets/profile.jpeg` 改成新图片文件名。

## 用 GitHub Desktop 发布

1. 打开 GitHub Desktop。
2. 选择 `File` -> `Add local repository`，选中这个文件夹：`C:\Users\shenj\Documents\Codex\2026-05-12\files-mentioned-by-the-user-docx\jiajun.github.io`。
3. 如果 GitHub Desktop 提示这里还不是仓库，就选择创建仓库。
4. 仓库名要和你的 GitHub 用户名匹配：你现在的 GitHub 用户名是 `jiajun-shen`，所以用户主页仓库应命名为 `jiajun-shen.github.io`。
5. Commit 后点击 `Publish repository`。
6. 发布后通常可以通过 `https://jiajun-shen.github.io/` 访问。

GitHub 官方说明：用户或组织主页仓库必须命名为 `<user>.github.io` 或 `<organization>.github.io`。参考：[Creating a GitHub Pages site](https://docs.github.com/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 如果打开后是 404

先检查这三件事：

1. 仓库名是否是 `jiajun-shen.github.io`。如果现在还是 `jiajun.github.io`，它不会发布到 `https://jiajun-shen.github.io/` 这个根网址。
2. 仓库是否是 Public。GitHub Free 账号通常需要公开仓库才能使用公开的 GitHub Pages。
3. `Settings` -> `Pages` 里是否选择了 `Deploy from a branch`，分支选择 `main`，目录选择 `/ (root)`。

如果你暂时不想改仓库名，也可以把 `jiajun.github.io` 当成项目站点发布，但访问地址会变成 `https://jiajun-shen.github.io/jiajun.github.io/`，不是 `https://jiajun-shen.github.io/`。

## 隐私提醒

这个版本没有把手机号和年龄放到网页上，因为 GitHub Pages 是公开网站。邮箱已经放在页脚和联系按钮里，如果你想隐藏邮箱，也可以把 `mailto:shenjj2003@163.com` 替换成你的 GitHub 或 LinkedIn 链接。

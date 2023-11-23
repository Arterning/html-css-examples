const express = require('express');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;
const app = express();

app.get('/hello', (req, res) => {
    res.json({
        id: 1,
        name: 'hello'
    });
});

// 自定义中间件
app.use((req, res, next) => {
    // 获取请求路径
    let ask = decodeURIComponent(req.path)
    if (ask === '/') {
        ask = ''
        console.log('root dir');
    }
    const filePath = path.join(__dirname, 'public', ask);
    console.log(filePath);
    // 判断请求路径是否是目录
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
        console.log('exist');
        // 读取目录下所有文件和文件夹
        const files = fs.readdirSync(filePath);
        // 构建目录页面的 HTML 内容
        const html = `
            <h1>Files in ${ask}</h1>
            <ul>
                ${files.map(file => `<li><a href="${ask}/${file}">${file}</a></li>`).join('')}
            </ul>
        `;
        // 发送目录页面的 HTML 内容
        res.send(html);
    } else {
        // 如果不是目录，则继续处理静态文件
        next();
    }
});

/**
 * 静态资源不仅可以是jpeg css
 * 你也可以直接把html放到这里面
 */
app.use(express.static('public'));


app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

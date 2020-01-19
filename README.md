# 注意

1.react 要想支持装饰器，一定要 react eject,不然 babel 的配置没用

2.图片编辑器的使用：svg icon 需要在 public 文件夹放好；除了插件 npm 包本身还需要 npm 装一个
fabric npm 包

"electron": "^6.0.5",

electron7 版本下载方法，
前往淘宝镜像
https://npm.taobao.org/mirrors/electron/7.0.0/
手动下载对应的包，我用 windows，所以下载 electron-v7.0.0-win32-x64.zip
然后在 node_modules\electron\下创建 dist 文件夹。
将下载的压缩包解压进刚刚创建的 dist。
在 node_modules\electron\中创建 path.txt，内容为 electron.exe（对应自己的平台，不同平台不一样）。

现在运行，已经可以正常启动了。
————————————————
版权声明：本文为 CSDN 博主「Leon-o」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u013584271/article/details/102764898

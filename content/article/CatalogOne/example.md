# 文章示例

Markdown 是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。Markdown 文件的后缀名是 `.md`

## 基础语法

### 字体样式

*斜体字*

**粗体**

~~删除线~~ ~删除~

### 链接

[链接](https://mail.google.com/123)

### 图片

![Content Wind](https://i.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA)

### 引用

> 引用文本 Blockquotes

### 列表

#### 无序列表

* 列表一
  * 内嵌列表 1
  * 内嵌列表 2
  * 内嵌列表 3
    * 深度嵌套列表 a
    * 深度嵌套列表 b
    * 深度嵌套列表 c
* 列表二
* 列表三

#### 有序列表

1. 第一行
    1. 内嵌列表 1
    2. 内嵌列表 2
    3. 内嵌列表 3
2. 第二行
3. 第三行


### 代码

行内代码 `npm install marked`

代码块（经过定制）

```javascript
console.log('hello world!')
```

### 表格

| First Header  | Second Header | three Header  | First Header  | Second Header | three Header  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  |
| Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  |
| Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  |
| Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  | Content Cell  |

### 脚注

Here's a first footnote [^1] and here's the second number footnote [^2].

### 其他

分割线

---

### 表情符号

[emoji](https://www.webfx.com/tools/emoji-cheat-sheet/) :smile: :bulb: :warning:

## 拓展语法

### 数学公式
行内的公式 $E=mc^2$

公式块

$$
\begin{aligned}
P \times A
&=
\begin{bmatrix}
  0& 1\\
  1& 0
\end{bmatrix}
\begin{bmatrix}
  a& b\\
  c& d
\end{bmatrix}
&=
\begin{bmatrix}
  c&d \\
  a&b
\end{bmatrix}
\end{aligned}
$$

双击公式可以实现复制公式的 LaTex 代码，支持的公式符号可以参考 [KaTeX 的官方文档](https://katex.org/docs/supported.html)

### 字体样式

上标 x^2^

下标 O_2_

++增加++

--删除--

//评论//

==高亮==

### 图片组

图片组（单张图片）

::ImageList{height='400px'}
![1029](https://picsum.photos/id/1029/1080)
::

图片组（多张图片）

::ImageList{height='400px'}
![0](https://picsum.photos/id/0/200)
![1002](https://picsum.photos/id/1002/600)
![1011](https://picsum.photos/id/1011/400)
![1015](https://picsum.photos/id/1015/500)
![1026](https://picsum.photos/id/1026/800)
![1029](https://picsum.photos/id/1029/1080)
![1039](https://picsum.photos/id/1039/800/1000)
![1043](https://picsum.photos/id/1043/600/800)
![1058](https://picsum.photos/id/1058/1000)
::



[^1]: This is the first number footnote.
[^2]: This is the first number footnote.

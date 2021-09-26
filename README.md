# ByteApiTestTool

Test API from codes snippet in vscode without affecting your other codes.

You just need to simply make comments around your codes that invoke `axios.get` or `axios.post`

```javascript
// API START
const data = await axios.get('/foo');
// API END
```

## Screenshot

[![4ymWUP.gif](https://z3.ax1x.com/2021/09/26/4ymWUP.gif)](https://imgtu.com/i/4ymWUP)

## General idea

1. Get codes from currently opened document
2. Match comments
3. Get code snippet
4. Setup axios response interceptor
5. Generate a runnable javascript file (TODO: Parse config if there exists a singleton of axios set up in advance)
6. Run this file
7. Save response temporarily
8. Show status code, data, header of response on result window

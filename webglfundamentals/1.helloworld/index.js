const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  varying vec4 v_Color;

  uniform mat4 u_Translate;
  uniform mat4 u_Rotate;

  void main() { 
    gl_Position = a_Position * u_Translate * u_Rotate;
    v_Color = gl_Position * 0.5 + 0.5;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;

  void main() { gl_FragColor = v_Color; }
`

function main() {
  const canvas = document.getElementById('canvas')
  const gl = getWebGLContext(canvas)

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.')
    return
  }

  // 创建顶点缓冲区
  if (!initVertexBuffer(gl)) {
    console.log('Failed to init vertex buffer.')
    return
  }

  // // 片元shader 直接创建
  // const uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
  // gl.uniform4f(uFragColor, 1.0, 1.0, 0.0, 1.0)

  // 变换矩阵

  // 视角
  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)

  let then = 0
  function render(now) {
    now *= 30
    const deltaTime = now - then
    then = now

    drawScene(gl, deltaTime)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

function drawScene(gl, deltaTime) {
  // canvas 背景色
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  // 使用预设值清空缓冲
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 顶点着色器
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')

  // 平移矩阵
  const uTranslate = gl.getUniformLocation(gl.program, 'u_Translate')

  let x = 1
  // prettier-ignore
  const translateMaritx = new Float32Array([
      1.0, 1.0, 0.0, 0.0,
      0.0, x, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ])
  gl.uniformMatrix4fv(uTranslate, false, translateMaritx)

  // 旋转矩阵
  const uRotate = gl.getUniformLocation(gl.program, 'u_Rotate')

  let angle = 10
  angle += deltaTime

  const radian = (Math.PI * angle) / 180

  cosR = Math.cos(radian)
  sinR = Math.sin(radian)

  // prettier-ignore
  const uxformMatrix = new Float32Array([
        cosR, sinR, 0.0, 0.0,
        -sinR, cosR, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
      ])
  gl.uniformMatrix4fv(uRotate, false, uxformMatrix)

  // 开启从缓冲中获取数据
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  gl.drawArrays(gl.TRIANGLES, 0, 3 * 2)
}

function initVertexBuffer(gl) {
  // prettier-ignore
  const positionArr = [
    -0.5, -0.5,
    0,0.5,
    0.5,-0.5
  ]

  const vertices = new Float32Array(positionArr)

  const verticesBuffer = gl.createBuffer()

  if (!verticesBuffer) {
    console.log('Failed to create buffer')
    return
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  return true
}

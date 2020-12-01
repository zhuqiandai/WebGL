const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TextCoord;
  varying vec2 v_TextCoord;

  void main() {
    gl_Position = a_Position;
    v_TextCoord = a_TextCoord;
  }
`

// precision mediump float 指定精度
const FSHADER_SOURCE = `
  precision mediump float;

  uniform sampler2D u_Sampler;
  varying vec2 v_TextCoord;

  void main(){
    gl_FragColor = texture2D(u_Sampler, v_TextCoord);
  }
`

function main() {
  const canvas = document.getElementById('canvas')
  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.')
    return
  }

  // 获取存储变量的位置
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')

  const aFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  const n = initVertexBuffers(gl)

  if (!initTexture(gl, n)) {
    console.log('faild to initalize texture')
    return
  }

  if (aPosition < 0 || aFragColor < 0) {
    console.log('Failed to get storge position')
  }

  gl.uniform4f(aFragColor, 0.0, 0.0, 1.0, 1.0)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

function initVertexBuffers(gl) {
  // prettier-ignore
  const vertices = new Float32Array([
    -0.5, -0.5, 0.0, 0.0,
    -0.5, 0.5, 0.0, 1.0,
     0.5, 0.5, 1.0, 1.0,
     0.5, -0.5, 1.0, 0.0
  ])
  const n = 4

  const vertexBuffer = gl.createBuffer()

  if (!vertexBuffer) {
    console.log('Failed to create buffer')
    return -1
  }

  const FSIZE = vertices.BYTES_PER_ELEMENT

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(aPosition)

  const aTextCoord = gl.getAttribLocation(gl.program, 'a_TextCoord')
  gl.vertexAttribPointer(aTextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(aTextCoord)

  return n
}

function initTexture(gl, n) {
  const texture = gl.createTexture()

  const uSampler = gl.getUniformLocation(gl.program, 'u_Sampler')

  const image = new Image()

  image.onload = function () {
    loadTexture(gl, n, texture, uSampler, image)
    image.src = '../img/texture_pic.jpeg'
    return true
  }
}

function loadTexture(gl, n, texture, uSampler, image) {
  // Y 轴旋转
  gl.pixelStorei(gl.UPPACK_FLIP_Y_WEBGL, 1)

  // 激活 0号 纹理
  gl.activeTexture(gl.TEXTURE0)

  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // 配置纹理参数
  gl.texParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  // 配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  // 把 0号 纹理传递给着色器
  gl.uniform1i(uSampler, 0)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
}

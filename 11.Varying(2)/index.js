function main() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;

    attribute vec4 a_Color;
    varying vec4 v_Color;

    void main() {
      gl_Position = a_Position;
      gl_PointSize = a_PointSize;
      v_Color = a_Color;
    }
    `

  // precision mediump float 指定精度
  const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;

    varying vec4 v_Color;

      void main(){
        gl_FragColor =v_Color;
      }
    `

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

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  // 获取存储变量的位置
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  const aFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  if (aPosition < 0 || aFragColor < 0) {
    console.log('Failed to get storge position')
  }

  const n = initVertexBuffers(gl)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function tick() {}

function initVertexBuffers(gl) {
  // prettier-ignore
  const vertices = new Float32Array([
    0.0, 0.3, 10.0, 1.0, 0.0, 0.0,
    -0.3, -0.3, 20.0, 0.0, 1.0, 0.0,
    0.3, -0.3, 30.0, 0.0, 0.0, 1.0
  ])
  const n = 3

  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log('Failed to create buffer')
    return -1
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const FSIZE = vertices.BYTES_PER_ELEMENT

  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(aPosition)

  const aPointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(aPointSize)

  const aColor = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(aColor)

  return n
}

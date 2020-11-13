function main() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;

    void main() {
      gl_Position = a_Position;
      gl_PointSize = a_PointSize;
    }
    `

  // precision mediump float 指定精度
  const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;

      void main(){
        gl_FragColor = u_FragColor;
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

  gl.clearColor(1.0, 0.0, 0.0, 1.0)

  // 获取存储变量的位置
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  const aFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  if (aPosition < 0 || aFragColor < 0) {
    console.log('Failed to get storge position')
  }

  // const size = [Math.random(), Math.random(), Math.random()]

  const n = initVertexBuffers(gl)

  // gl.vertexAttrib3f(aPosition, size[0], size[1], size[2])
  gl.uniform4f(aFragColor, 0.0, 0.0, 1.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, n)
}

function tick() {}

function initVertexBuffers(gl) {
  // prettier-ignore
  const vertices = new Float32Array([
    0.0, 0.3, 10.0,
    -0.3, -0.3, 20.0,
    0.3, -0.3, 30.0
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
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 3, 0)
  gl.enableVertexAttribArray(aPosition)

  const aPointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2)
  gl.enableVertexAttribArray(aPointSize)

  return n
}

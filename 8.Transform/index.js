function main() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;

    void main() {
      gl_Position = a_Position;
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

  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.2, -0.2, -0.2, 0.2, -0.2])
  const n = 3

  // 1. 创建buffer
  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log('Failed to create buffer')
    return -1
  }

  // 2. 绑定buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  // 3. 向buffer中写入数据
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // 4. 将buffer数据分配给 a_Position
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  // 5. 连接 a_Position 变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(aPosition)

  return n
}

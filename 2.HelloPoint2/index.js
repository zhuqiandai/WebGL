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
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 获取存储变量的位置
  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')

  const aPointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

  const aFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  if (aPosition < 0 || aPointSize < 0 || aFragColor < 0) {
    console.log('Failed to get storge position')
  }

  const size = [Math.random(), Math.random(), Math.random()]

  //
  gl.vertexAttrib3f(aPosition, size[0], size[1], size[2])
  gl.vertexAttrib1f(aPointSize, 30.0)

  gl.uniform4f(aFragColor, 0.0, 0.0, 1.0, 1.0)

  gl.drawArrays(gl.POINTS, 0, 1)
}

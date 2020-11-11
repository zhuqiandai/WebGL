function main() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position

    void main() {
      gl_Position = a_Position;
      gl_PointSize = 10.0;
    }
    `

  const FSHADER_SOURCE = `
      void main(){
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
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
  const aPosition = gl.getAttribLocation(program, 'a_Position')

  //
  gl.vertexAttrib3f(aPosition, 0.5, 0.5, 0.0)

  gl.drawArrays(gl.POINTS, 0, 1)
}

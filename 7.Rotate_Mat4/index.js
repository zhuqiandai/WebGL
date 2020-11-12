function main() {
  const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;

    void main(){
      gl_Position = a_Position * u_xformMatrix;
    }
  `
  const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    
    void main(){
      gl_FragColor = u_FragColor;
    }
  `

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

  // 旋转弧度
  const Angle = 90
  const radian = (Math.PI * Angle) / 180

  const cosB = Math.cos(radian)
  const sinB = Math.sin(radian)
  // prettier-ignore
  const uxformMatrix = new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  ])

  const uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

  const uXformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  gl.uniformMatrix4fv(uXformMatrix, false, uxformMatrix)

  const n = initVertexBuffers(gl)

  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.uniform4f(uFragColor, 0.0, 0.0, 1.0, 1.0)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5])
  const n = 3

  const buffer = gl.createBuffer()
  if (!buffer) {
    console.log('Failed to create buffer')
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  gl.enableVertexAttribArray(aPosition)

  return n
}

// import { visit } from 'unist-util-visit'

export default function remarkSub () {
  function transformer (ast) {
    console.log(ast)
  }

  return transformer
}

import { Suspense, lazy, useState } from 'react'

import '@/App.css'
import memberList from './test.json'
import Class from '@/components/Class'
import { Demo1, Demo2 } from '@/components'
const LazyDemo = lazy(() => import('@/components/LazyDemo')) // 使用import语法配合react的Lazy动态引入资源
console.log('memberList', memberList)
function App() {
  const [show, setShow] = useState(false)

  // 点击事件中动态引入css, 设置show为true
  const handleOnClick = () => {
    import('@/App.css')
    setShow(true)
  }

  return (
    <div>
      <h2>webpack5-react-ts</h2>
      <div>
        <div>scssBox</div>
        <Class />
        <div>
          <p>受控组件</p>
          <input type='text' />
          <br />
          <p>非受控组件</p>
          <input type='text' />
        </div>
        <Demo1 />
        <h2 onClick={handleOnClick}>展示</h2>
        {/* show为true时加载LazyDemo组件 */}
        {show && (
          <Suspense fallback={null}>
            <LazyDemo />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default App

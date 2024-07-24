import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { useEffect, useRef } from 'react'
import ePub from '../../epubjs/src'

export default function Index() {
  const renditionRef = useRef()

  useLoad(() => {
    console.log('Page loaded.')
  })

  useEffect(() => {
      const book = ePub('https://blog.calvin.wang/assets/first-epub.epub')
      renditionRef.current = book.renderTo('area', {
        width: 600,
        height: 400,
        method: 'default'
      })
      renditionRef.current.display()
  }, [])

  const clickPrev = () => {
    renditionRef.current.prev()
  }

  const clickNext = () => {
    renditionRef.current.next()
  }

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <View id='area'></View>
      <Button onClick={clickPrev}>prev</Button>
      <Button onClick={clickNext}>next</Button>
    </View>
  )
}

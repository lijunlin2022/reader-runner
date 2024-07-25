import { View, Button, Picker } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { useEffect, useRef, useState } from 'react'
import ePub from '../../epubjs/src'

export default function Index() {
  const renditionRef = useRef()
  const [fontSizeRange] = useState([14, 16, 18])
  const [currentFontSize, setCurrentFontSize] = useState(14)
  const [fontFamilyRange] = useState([
    'Microsoft Yahei',
    'KaiTi',
    'FangSong'
  ])
  const [currentFontFamily, setCurrentFontFamily] = useState('Microsoft Yahei')
  const [meta, setMeta] = useState({})
  const [nav, setNav] = useState([])

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
      book.loaded.metadata.then(metadata => {
        setMeta(metadata)
      })
      book.loaded.navigation.then(navdata => {
        setNav(navdata.toc)
      })
  }, [])

  const clickPrev = () => {
    renditionRef.current.prev()
  }

  const clickNext = () => {
    renditionRef.current.next()
  }

  const changeFontSize = (e) => {
    const index = e.detail.value
    const size = fontSizeRange[index]
    setCurrentFontSize(size)
    renditionRef.current.themes.fontSize(size)
  }

  const changeFontFamily = (e) => {
    const index = e.detail.value
    const family = fontFamilyRange[index]
    setCurrentFontFamily(family)
    renditionRef.current.themes.font(family)
  }

  return (
    <View className='index'>
      <View id='area'></View>
      <View>{meta.title}</View>
      <View>
        {nav.map(navItem => (
          <View key={navItem.id}>{navItem.label}</View>
        ))}
      </View>
      <Button onClick={clickPrev}>prev</Button>
      <Button onClick={clickNext}>next</Button>
      <Picker mode='selector' range={fontSizeRange} onChange={changeFontSize}>
        <View>字号: {currentFontSize}</View>
      </Picker>
      <Picker mode='selector' range={fontFamilyRange} onChange={changeFontFamily}>
        <View>字体: {currentFontFamily}</View>
      </Picker>
    </View>
  )
}

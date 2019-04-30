import React from 'react'
import {
    beforePage,
    example,
    directive,
    custom,
    scene,
    principle,
} from '../document1.0/markdown'

import {
    upgrade,
    context,
} from '../document2.0/markdown'

export const versionList = [
    {
        title: '版本v1',
        version: '1.x',
        path: '/document1.0',
        autoPage: 'before',
        menuList: [
            {title: '前言', key: 'before', md: beforePage},
            {title: '实例', key: 'example', md: example},
            {title: '指令', key: 'directive', md: directive},
            {title: '自定义指令', key: 'custom', md: custom},
            {title: '使用场景', key: 'scene', md: scene},
            {title: '实现原理', key: 'principle', md: principle}
        ]
    },
    {
        title: '版本v2',
        version: '2.x',
        path: '/document2.0',
        autoPage: 'upgrade',
        menuList: [
            {title: '升级内容', key: 'upgrade', md: upgrade},
            {title: '统一上下文', key: 'context', md: context},
        ]
    }
]
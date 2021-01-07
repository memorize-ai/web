import { useLayoutEffect, useEffect } from 'react'

const useIsomorphicLayoutEffect = process.browser ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect

import { words } from 'tiny-case'
import type {
  BackdropSizes,
  LogoSizes,
  PosterSizes,
  ProfileSizes,
  StillSizes,
} from 'tmdb-ts'

export type ImageSize =
  | `${LogoSizes}`
  | `${StillSizes}`
  | `${PosterSizes}`
  | `${ProfileSizes}`
  | `${BackdropSizes}`

export function snakeCase(str: string) {
  return words(str).join('_')
}

export function getImagePath(imagePath: string, size: ImageSize) {
  return `https://image.tmdb.org/t/p/${size}${imagePath}`
}

export function isElementInViewport(
  el: Element | null,
  container: Element | null
) {
  if (!el || !container) return false

  const rect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  return (
    rect.top >= containerRect.top &&
    rect.left >= containerRect.left &&
    rect.bottom <= containerRect.bottom &&
    rect.right <= containerRect.right
  )
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function createSwiper(root: Element | null, findLast?: boolean) {
  if (!root) return

  const swiper = root.querySelector('.swiper')
  const buttons = root.querySelectorAll('.swiper-button')
  const items = swiper?.querySelectorAll('.swiper-item')
  const elements = [...(items?.values() ?? [])]
  const lastIndex = elements.length - 1

  buttons?.forEach(el => {
    const isLeftButton = el.classList.contains('swiper-left')

    el.addEventListener('click', () => {
      const activeItemIndex =
        isLeftButton || !findLast
          ? elements.findIndex(el => isElementInViewport(el, swiper))
          : elements.findLastIndex(el => isElementInViewport(el, swiper))

      if (activeItemIndex === -1) return

      const newItemIndex = isLeftButton
        ? activeItemIndex === 0
          ? lastIndex
          : activeItemIndex - 1
        : activeItemIndex === lastIndex
          ? 0
          : activeItemIndex + 1

      console.log({ activeItemIndex, newItemIndex })
      items?.item(newItemIndex).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    })
  })
}

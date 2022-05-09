/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, getPage, initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers()

const handler = [
  rest.get(
    'https://jsonplaceholder.typicode.com/posts/?_limit=10',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          { userId: 1, id: 1, title: 'dummy title 1', body: 'dummy body 1' },
          { userId: 2, id: 2, title: 'dummy title 2', body: 'dummy body 2' },
        ])
      )
    }
  ),
]

const server = setupServer(...handler)
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())

describe('Blog Page', () => {
  it('Should render the list of posts pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({ route: '/blog-page' })
    render(page)
    expect(await screen.findByText('blog page')).toBeInTheDocument()
    expect(screen.getByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy title 2')).toBeInTheDocument()
  })
})

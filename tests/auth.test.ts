import { afterEach, mock, test } from 'node:test'
import assert from 'node:assert/strict'
import { AuthError, createAuthApi } from '../src/features/auth/auth.api.ts'

const api = createAuthApi('https://api.example.test/')
const user = { id: 'user-1', name: 'Test User', email: 'test@example.com' }

afterEach(() => mock.restoreAll())

test('login sends JSON credentials and reads the session response', async () => {
  const session = { user, token: 'test-token', expiresAt: '2030-01-01' }
  const fetch = mock.method(globalThis, 'fetch', async () =>
    Response.json(session),
  )

  assert.deepEqual(await api.login(user.email, 'a password'), session)
  const [url, options] = fetch.mock.calls[0].arguments
  assert.equal(url, 'https://api.example.test/auth/login')
  assert.equal(options?.method, 'POST')
  assert.deepEqual(JSON.parse(options?.body as string), {
    email: user.email,
    password: 'a password',
  })
  assert.equal(
    new Headers(options?.headers).get('Content-Type'),
    'application/json',
  )
})

test('incorrect credentials return readable feedback and a 401 status', async () => {
  mock.method(globalThis, 'fetch', async () =>
    Response.json({ message: 'Unauthorized' }, { status: 401 }),
  )

  await assert.rejects(api.login(user.email, 'wrong'), (error) => {
    assert.ok(error instanceof AuthError)
    assert.equal(error.status, 401)
    assert.equal(error.message, 'Your email or password is incorrect.')
    return true
  })
})

test('session restoration sends a bearer token and accepts wrapped user data', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () =>
    Response.json({ user }),
  )

  assert.deepEqual(await api.me('saved-token', new AbortController().signal), {
    user,
  })
  const [url, options] = fetch.mock.calls[0].arguments
  assert.equal(url, 'https://api.example.test/users/me')
  assert.equal(
    new Headers(options?.headers).get('Authorization'),
    'Bearer saved-token',
  )
})

test('logout revokes the token and accepts success with no JSON body', async () => {
  const fetch = mock.method(
    globalThis,
    'fetch',
    async () => new Response(null, { status: 204 }),
  )

  assert.equal(await api.logout('active-token'), undefined)
  const [url, options] = fetch.mock.calls[0].arguments
  assert.equal(url, 'https://api.example.test/auth/logout')
  assert.equal(options?.method, 'POST')
  assert.equal(
    new Headers(options?.headers).get('Authorization'),
    'Bearer active-token',
  )
})

test('network failures return useful feedback', async () => {
  const cause = new TypeError('Failed to fetch')
  mock.method(globalThis, 'fetch', async () => {
    throw cause
  })

  await assert.rejects(api.login(user.email, 'password'), {
    message: 'Cannot reach the server. Please try again.',
    cause,
  })
})

test('non-JSON server errors fall back to a readable message', async () => {
  mock.method(
    globalThis,
    'fetch',
    async () => new Response('Unavailable', { status: 503 }),
  )

  await assert.rejects(api.login(user.email, 'password'), {
    message: 'Something went wrong. Please try again.',
    status: 503,
  })
})

test('missing configuration never sends credentials to an unintended host', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => Response.json({}))

  await assert.rejects(
    createAuthApi('').login(user.email, 'password'),
    /Set VITE_API_URL/,
  )
  assert.equal(fetch.mock.callCount(), 0)
})

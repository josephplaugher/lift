import { describe, it, expect } from 'vitest'
import ApiUrl from '../src/utilities/ApiUrl';

describe('ApiURL', () => {
    it('returns dev url when in dev mode', async () => {
        process.env.NODE_ENV = "developement";
        const url = ApiUrl()
        expect(url).toContain("lift.josephplaugher.com");
    })
})

describe('ApiUrl', () => {
    it('returns production url in prod mode', async () => {
        process.env.NODE_ENV = "production";
        const url = ApiUrl()
        expect(url).toContain("lift.josephplaugher.com");
    })
})

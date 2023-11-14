import { expect, it } from '@jest/globals'
import { server } from '../index';
import assert from 'assert';

server.executeOperation

it("Runs health check against graphql schema",async ()=>{
    const result=await server.executeOperation({
        query: `query UserByEmail($email: String) {
            userByEmail(email: $email) {
              email
              name
              image
              position
              role {
                name
              }
            }
          }`,
          variables:{email:"johnhernandez@test.com"}
    })
    assert(result.body.kind==='single');
    expect(result.body.singleResult.errors).toBeUndefined();
   
})
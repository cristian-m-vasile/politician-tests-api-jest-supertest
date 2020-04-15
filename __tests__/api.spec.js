omit = require('lodash.omit')
request = require('supertest')
request = request('http://ec2-34-250-139-60.eu-west-1.compute.amazonaws.com/peps')

describe("peps endpoint", () => {
    describe("GET request", () => {
        let res;
        
        beforeEach(async () => {
            res = await request.get('')
        })

        it('returns correct status code', async () => {
            expect(res.statusCode).toEqual(200)
        })

        it('returns 5 entries', async () => {
            expect(res.body.length).toEqual(5)
        })

        it('returns items ordered by date of creation', async () => {
            let created_at_dates = []
            res.body.forEach(politician => {
                created_at_dates.push(new Date(politician.createdAt))
            })
            let sorted_created_at_dates = created_at_dates.slice().sort((a, b) => b - a)
            expect(created_at_dates, '"Created At" dates should be in descending order').toEqual(sorted_created_at_dates)
        })

        it('all entries contain mandatory fields', () => {
            res.body.forEach(politician => {
                expect(politician).toHaveProperty('name')
                expect(politician).toHaveProperty('country')
                expect(politician).toHaveProperty('yob')
                expect(politician).toHaveProperty('position')
                expect(politician).toHaveProperty('risk')
            })
        })

        it('all entries have mandatory fields of the correct type', () => {
            res.body.forEach(politician => {
                expect(typeof politician.name).toBe('string')
                expect(typeof politician.country).toBe('string')
                expect(typeof politician.yob).toBe('number')
                expect(typeof politician.position).toBe('string')
                expect(typeof politician.risk).toBe('number')
            })
        })
    })

    describe("POST request", () => {
        let res;
        let new_id;
        let default_post_body = {
            name: 'John Doe',
            country: 'UK',
            yob: 1945,
            position: 'Champion of the World',
            risk: 5
        }
        
        beforeEach(async () => {
            res = await request
                .post('')
                .send(default_post_body)
            new_id = res.body.id
        })

        it('returns correct status code', async () => {
            expect(res.statusCode).toEqual(201)
        })

        it('adds entry to the top of the list', async() => {
            get_response = await request.get('')
            let first_entry = get_response.body[0]
            //check that response body contains post body
            expect(first_entry).toEqual(expect.objectContaining(default_post_body))
        })

        it('GET to returned id contains same body as post body', async() => {
            get_response = await request.get('/' + new_id)
            //check that response body contains post body
            expect(get_response.body).toEqual(expect.objectContaining(default_post_body))
        })

        describe("omitting mandatory fields", () => {
            for(property in default_post_body) {
                // omit each mandatory field
                let modified_post_body = omit(default_post_body, property)
                it(`throws error when ${property} field is ommited`, async () => {
                    res = await request
                        .post('')
                        .send(modified_post_body)
                    expect(res.statusCode).toEqual(400)
                })
            }
        })
    })
})

describe("peps/id endpoint", () => {
    let first_entry_id;
    let first_entry;

    beforeEach(async () => {
        let pep_get = await request.get('')
        first_entry = pep_get.body[0]
        first_entry_id = first_entry.id
    })

    describe("GET request", () => {
        let res;
        
        beforeEach(async () => {
            res = await request.get('/' + first_entry_id)
        })

        it('returns correct status code', async () => {
            expect(res.statusCode).toEqual(200)
        })

        it('returns same first entry when searching by id', async () => {
            expect(res.body).toEqual(first_entry)
        })

        it('contains mandatory fields', () => {
            expect(res.body).toHaveProperty('name')
            expect(res.body).toHaveProperty('country')
            expect(res.body).toHaveProperty('yob')
            expect(res.body).toHaveProperty('position')
            expect(res.body).toHaveProperty('risk')
        })

        it('has mandatory fields of the correct type', () => {
            expect(typeof res.body.name).toBe('string')
            expect(typeof res.body.country).toBe('string')
            expect(typeof res.body.yob).toBe('number')
            expect(typeof res.body.position).toBe('string')
            expect(typeof res.body.risk).toBe('number')
        })
    })
})


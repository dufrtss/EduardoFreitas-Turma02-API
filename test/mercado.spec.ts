import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';

interface Mercado {
  id: number
  nome: string
  cnpj: string
  endereco: string
}

interface Food {
  id: number
  nome: string
  valor: number
}

interface Fruit extends Food {}
interface Vegetable extends Food {}
interface Sweet extends Food {}

describe('Mercado API', () => {
  const p = pactum;
  const rep = SimpleReporter;

  const baseUrl = 'https://api-desafio-qa.onrender.com';

  let mercado: Mercado

  let fruta: Fruit
  let legume: Vegetable
  let doce: Sweet

  beforeAll(async () => {
    p.reporter.add(rep);

    mercado = await p
      .spec()
      .post(`${baseUrl}/mercado`)
      .withBody({
        nome: faker.company.name(),
        cnpj: faker.string.numeric(14),
        endereco: faker.lorem.sentence()
      })

    fruta = await p
      .spec()
      .post(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/frutas`)
      .withBody({
        nome: faker.food.fruit(),
        valor: faker.finance.amount()
      })

    legume = await p
      .spec()
      .post(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/legumes`)
      .withBody({
        nome: faker.food.fruit(),
        valor: faker.finance.amount()
      })
  });

  afterAll(() => p.reporter.end());

  it('[GET] /mercado', async () => {
    await p
      .spec()
      .get(`${baseUrl}/mercado`)
      .expectStatus(StatusCodes.OK)
  });

  it('[POST] /mercado', async () => {
    const novoMercado = {
      nome: faker.company.name(),
      cnpj: faker.string.numeric(14),
      endereco: faker.lorem.sentence()
    }

    await p
      .spec()
      .post(`${baseUrl}/mercado`)
      .withBody(novoMercado)
      .expectStatus(StatusCodes.CREATED)
      .expectBodyContains(novoMercado.nome)
  });

  it('[GET] /mercado/:id', async () => {
    await p
      .spec()
      .get(`${baseUrl}/mercado/${mercado.id}`)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains('Angeloni Jamais Visto 22')
  })

  it('[PUT] /mercado/:id', async () => {
    const novoMercado = {
      nome: faker.company.name(),
      cnpj: faker.string.numeric(14),
      endereco: faker.lorem.sentence()
    }

    await p
      .spec()
      .put(`${baseUrl}/mercado/${mercado.id}`)
      .withBody(novoMercado)
      .expectStatus(StatusCodes.OK)
      .expectBodyContains(novoMercado.nome)
  });

  it('[DELETE] /mercado/:id', async () => {
    const novoMercado = await p
      .spec()
      .put(`${baseUrl}/mercado/${mercado.id}`)
      .withBody({
        nome: faker.company.name(),
        cnpj: faker.string.numeric(14),
        endereco: faker.lorem.sentence()
      });

    await p
      .spec()
      .delete(`${baseUrl}/mercado/${novoMercado.id}`)
      .expectStatus(StatusCodes.OK)
  });

  it('[POST] /mercado/:id/produtos/hortifruit/frutas', async () => {
    const novaFruta = {
      nome: faker.food.fruit(),
      valor: faker.finance.amount()
    }
    
    await p
      .spec()
      .post(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/frutas`)
      .withBody(novaFruta)
      .expectStatus(StatusCodes.CREATED)
      .expectBodyContains(novaFruta.nome)
  });

  it('[GET] /mercado/:id/produtos', async () => {
    await p
      .spec()
      .get(`${baseUrl}/mercado/${mercado.id}/produtos`)
      .expectStatus(StatusCodes.OK)
  })

  it('[GET] /mercado/:id/produtos/hortifruit/frutas', async () => {
    await p
      .spec()
      .get(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/frutas`)
      .expectStatus(StatusCodes.OK)
  })

  it('[DELETE] /mercado/:id/produtos/hortifruit/frutas/:id', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/frutas/${fruta.id}`)
      .expectStatus(StatusCodes.OK)
  })

  it('[POST] /mercado/:id/produtos/hortifruit/legumes', async () => {
    const novoLegume = {
      nome: faker.food.vegetable(),
      valor: faker.finance.amount()
    }
    
    await p
      .spec()
      .post(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/legumes`)
      .withBody(novoLegume)
      .expectStatus(StatusCodes.CREATED)
      .expectBodyContains(novoLegume.nome)
  });

  it('[GET] /mercado/:id/produtos/hortifruit/legumes', async () => {
    await p
      .spec()
      .get(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/legumes`)
      .expectStatus(StatusCodes.OK)
  })

  it('[DELETE] /mercado/:id/produtos/hortifruit/legumes/:id', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/mercado/${mercado.id}/produtos/hortifruit/legumes/${legume.id}`)
      .expectStatus(StatusCodes.OK)
  })

  it('[POST] /mercado/:id/produtos/padaria/doces', async () => {
    const novoDoce = {
      nome: faker.food.dish(),
      valor: faker.finance.amount()
    }
    
    await p
      .spec()
      .post(`${baseUrl}/mercado/${mercado.id}/produtos/padaria/doces`)
      .withBody(novoDoce)
      .expectStatus(StatusCodes.CREATED)
      .expectBodyContains(novoDoce.nome)
  });

  it('[GET] /mercado/:id/produtos/padaria/doces', async () => {
    await p
      .spec()
      .get(`${baseUrl}/mercado/${mercado.id}/produtos/padaria/doces`)
      .expectStatus(StatusCodes.OK)
  })

  it('[DELETE] /mercado/:id/produtos/padaria/doces/:id', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/mercado/${mercado.id}/produtos/padaria/doces/${doce.id}`)
      .expectStatus(StatusCodes.OK)
  })
})

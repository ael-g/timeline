type Qualifier = {
    key: string,
    value: string,
    attr: any[]
}

const attributes : Qualifier[] = [
  {
    key: 'occupations',
    value: 'P106',
    attr: [],
  },
  {
    key: 'notableWork',
    value: 'P800',
    attr: [],
  },
  {
    key: 'positionHeld',
    value: 'P39',
    attr: [
      { start: 'P580' },
      { end: 'P582' },
    ],
  },
];

export { attributes };
export type { Qualifier };

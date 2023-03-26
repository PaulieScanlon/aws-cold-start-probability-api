const { getDB } = require('../pg');

module.exports.handler = async (event) => {
  const db_start = performance.now();
  const client = await getDB().connect();
  const { date, runtime } = JSON.parse(event.body);

  try {
    const response = await client.query('INSERT INTO results (date, runtime) VALUES($1, $2) RETURNING id', [
      date,
      runtime,
    ]);
    const db_end = performance.now();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Create v1 - A-OK!',
          results: {
            id: response.rows[0].id,
            db_start: db_start,
            db_end: db_end,
          },
        },
        null,
        2
      ),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: 'Create v1 - Error!',
        },
        null,
        2
      ),
    };
  } finally {
    client.release();
  }
};

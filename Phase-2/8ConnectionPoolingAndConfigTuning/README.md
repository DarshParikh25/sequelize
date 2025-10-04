# Connection Pooling & Config Tuning

## What is Connection Pooling?

- Databases like PostgreSQL cannot handle a new connection **per request** efficiently.
- A **pool** is a collection of reusable DB connections maintained by Sequelize.
- When your app needs to query, Sequelize borrows a connection from the pool, executes, and then returns it for reuse.

## Analogy

Think of a restaurant:

- Instead of hiring a new waiter for every customer, the restaurant has a fixed set of waiters (pool).
- When a customer arrives, a waiter is assigned, serves them, then returns to be available for the next customer.
- Without pooling → restaurant collapses because hiring a new waiter each time is too slow and costly.

## Sequelize Connection Pool Config

When initializing Sequelize, you can configure the pool:

```js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mydb", "username", "password", {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 10, // Maximum number of connections in pool
    min: 2, // Minimum number of connections
    acquire: 30000, // Max time (ms) Sequelize tries to get a connection before throwing error
    idle: 10000, // Time (ms) a connection can be idle before being released
  },
  logging: console.log, // Or false to disable logging
});
```

## Config Tuning Guidelines

- `max` → set based on DB/server capacity. (Too high = DB overloaded, too low = requests wait).
- `min` → keep > 0 if you want connections always warm (reduces cold start delay).
- `acquire` → if requests spike, this is how long Sequelize will wait before failing.
- `idle` → balances memory usage vs connection churn.
- `logging` → disable in production (`logging: false`) to reduce noise.

## Reconnection Logic

- Sequelize automatically reconnects if a connection drops, but you should handle errors in production:

  ```js
  sequelize
    .authenticate()
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Connection Failed:", err));
  ```

If DB restarts, Sequelize pool recreates connections.

But long outages may still require restarting the app (depends on infra).

## Best Practices

1. Use environment variables for DB configs (`process.env.DB_MAX_POOL`, etc).
2. Monitor DB connections → don’t set `max` > DB’s actual connection limit.
3. Use **read replicas** for read-heavy workloads (Sequelize supports replication config).
4. Turn off logging in production. Instead, use structured logging (`winston`/`pino`).

## Common Pitfalls & Debugging

- **Too many open connections** → DB crashes. Always tune pool limits.
- Forgetting await sequelize.authenticate() → app may silently fail later.
- Idle timeout too low → pool keeps opening/closing connections, adds latency.
- Always test with load (e.g., Apache JMeter, k6) to tune pool.
- Log pool stats when debugging spikes.

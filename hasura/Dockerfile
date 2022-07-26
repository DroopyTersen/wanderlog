FROM hasura/graphql-engine:v2.8.4

# Enable the console
ENV HASURA_GRAPHQL_ENABLE_CONSOLE=true
# Enable debugging mode. It should be disabled in production.
ENV HASURA_GRAPHQL_DEV_MODE=true
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous
ENV HASURA_GRAPHQL_EXPERIMENTAL_FEATURES=naming_convention
ENV HASURA_GRAPHQL_DEFAULT_NAMING_CONVENTION=graphql-default

# Change $DATABASE_URL to your heroku postgres URL if you're not using
# the primary postgres instance in your app
CMD graphql-engine \
    --database-url $DATABASE_URL \
    serve \
    --server-port $PORT
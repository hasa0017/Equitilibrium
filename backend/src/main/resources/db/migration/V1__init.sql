-- Initial schema
CREATE TABLE app_user (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    display_name  VARCHAR(100)
);

CREATE TABLE watchlist (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE watchlist_item (
    id            BIGSERIAL PRIMARY KEY,
    watchlist_id  BIGINT NOT NULL REFERENCES watchlist(id) ON DELETE CASCADE,
    ticker        VARCHAR(20) NOT NULL,
    added_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    notes         TEXT,
    CONSTRAINT uq_watchlist_ticker UNIQUE (watchlist_id, ticker)
);

CREATE TABLE search_history (
    id            BIGSERIAL PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    ticker        VARCHAR(20) NOT NULL,
    searched_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_watchlist_user      ON watchlist(user_id);
CREATE INDEX idx_search_user_time    ON search_history(user_id, searched_at DESC);

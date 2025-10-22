<?php

namespace Lance\Sofascore;

class Setting
{
    public string $endpoint_sofascore = "https://api.sofascore.com/api/v1";

    public function getEndpointSofascore(): string
    {
        return rtrim($this->endpoint_sofascore, '/');
    }
}

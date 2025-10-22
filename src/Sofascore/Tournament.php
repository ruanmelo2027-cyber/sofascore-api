<?php

namespace Lance\Sofascore;

use GuzzleHttp\Client;

class Tournament
{
    private Client $client;
    private Setting $setting;

    public function __construct()
    {
        $this->setting = new Setting();
        $this->client = new Client([
            'base_uri' => $this->setting->getEndpointSofascore(),
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
                'Accept' => 'application/json, text/plain, */*',
                'Referer' => 'https://www.sofascore.com/',
                'Origin' => 'https://www.sofascore.com',
                'Accept-Language' => 'en-US,en;q=0.9',
                'Connection' => 'keep-alive'
            ],
            'verify' => false // ignora SSL se der problema
        ]);
    }

    public function list(): array
    {
        try {
            $response = $this->client->get('/sport/football/tournaments');
            $data = json_decode($response->getBody()->getContents(), true);

            if (!$data) {
                return ['erro' => 'Resposta vazia ou inválida da API SofaScore'];
            }

            return $data;
        } catch (\Throwable $e) {
            return ['erro' => $e->getMessage()];
        }
    }
}

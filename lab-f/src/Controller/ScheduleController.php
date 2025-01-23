<?php

namespace App\Controller;

class ScheduleController
{

    // Akcja do pobierania danych z API
    public function fetchSchedule($type, $query)
    {
        $apiUrl = $this->buildApiUrl($type, $query);

        $data = $this->fetchDataFromApi($apiUrl);

        if ($data === false) {
            // Obsługa błędu w przypadku niepowodzenia
            return [
                'success' => false,
                'message' => 'Nie udało się pobrać danych z API.'
            ];
        }

        return [
            'success' => true,
            'data' => json_decode($data, true) // Zwróć dane w formacie tablicy
        ];
    }

    // Budowanie URL na podstawie typu zapytania i wartości
    private function buildApiUrl($type, $query)
    {
        $baseUrl = "https://plan.zut.edu.pl/schedule.php";

        switch ($type) {
            case 'teacher':
                return "$baseUrl?kind=teacher&query=" . urlencode($query);
            case 'room':
                return "$baseUrl?kind=room&query=" . urlencode($query);
            case 'subject':
                return "$baseUrl?kind=subject&query=" . urlencode($query);
            case 'group':
                return "$baseUrl?kind=group&query=" . urlencode($query);
            default:
                throw new Exception("Nieprawidłowy typ zapytania: $type");
        }
    }

    // Pobieranie danych z API
    private function fetchDataFromApi($url)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            curl_close($ch);
            return false;
        }

        curl_close($ch);

        return $response;
    }


}
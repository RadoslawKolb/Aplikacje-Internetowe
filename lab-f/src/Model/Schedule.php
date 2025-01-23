<?php
namespace App\Model;

use App\Service\Config;

class Schedule
{
    private ?int $id = null;
    private ?int $idPrzedmiotu = null;
    private ?string $sala = null;
    private ?string $godzinaStartu = null;
    private ?string $godzinaKonca = null;
    private ?int $idWykladowcy = null;
    private ?int $idBudynku = null;
    private ?int $idGrupy = null;
    private ?int $idWydzialu = null;
    private ?string $data = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Schedule
    {
        $this->id = $id;
        return $this;
    }

    public function getIdPrzedmiotu(): ?int
    {
        return $this->idPrzedmiotu;
    }

    public function setIdPrzedmiotu(?int $idPrzedmiotu): Schedule
    {
        $this->idPrzedmiotu = $idPrzedmiotu;
        return $this;
    }

    public function getSala(): ?string
    {
        return $this->sala;
    }

    public function setSala(?string $sala): Schedule
    {
        $this->sala = $sala;
        return $this;
    }

    public function getGodzinaStartu(): ?string
    {
        return $this->godzinaStartu;
    }

    public function setGodzinaStartu(?string $godzinaStartu): Schedule
    {
        $this->godzinaStartu = $godzinaStartu;
        return $this;
    }

    public function getGodzinaKonca(): ?string
    {
        return $this->godzinaKonca;
    }

    public function setGodzinaKonca(?string $godzinaKonca): Schedule
    {
        $this->godzinaKonca = $godzinaKonca;
        return $this;
    }

    public function getIdWykladowcy(): ?int
    {
        return $this->idWykladowcy;
    }

    public function setIdWykladowcy(?int $idWykladowcy): Schedule
    {
        $this->idWykladowcy = $idWykladowcy;
        return $this;
    }

    public function getIdBudynku(): ?int
    {
        return $this->idBudynku;
    }

    public function setIdBudynku(?int $idBudynku): Schedule
    {
        $this->idBudynku = $idBudynku;
        return $this;
    }

    public function getIdGrupy(): ?int
    {
        return $this->idGrupy;
    }

    public function setIdGrupy(?int $idGrupy): Schedule
    {
        $this->idGrupy = $idGrupy;
        return $this;
    }

    public function getIdWydzialu(): ?int
    {
        return $this->idWydzialu;
    }

    public function setIdWydzialu(?int $idWydzialu): Schedule
    {
        $this->idWydzialu = $idWydzialu;
        return $this;
    }

    public function getData(): ?string
    {
        return $this->data;
    }

    public function setData(?string $data): Schedule
    {
        $this->data = $data;
        return $this;
    }

    public static function fromArray($array): Schedule
    {
        $schedule = new self();
        $schedule->fill($array);
        return $schedule;
    }

    public function fill($array): Schedule
    {
        if (isset($array['ID_Zajec']) && !$this->getId()) {
            $this->setId($array['ID_Zajec']);
        }
        if (isset($array['ID_Przedmiotu'])) {
            $this->setIdPrzedmiotu($array['ID_Przedmiotu']);
        }
        if (isset($array['Sala'])) {
            $this->setSala($array['Sala']);
        }
        if (isset($array['Godzina_Startu'])) {
            $this->setGodzinaStartu($array['Godzina_Startu']);
        }
        if (isset($array['Godzina_Konca'])) {
            $this->setGodzinaKonca($array['Godzina_Konca']);
        }
        if (isset($array['ID_Wykladowcy'])) {
            $this->setIdWykladowcy($array['ID_Wykladowcy']);
        }
        if (isset($array['ID_Budynku'])) {
            $this->setIdBudynku($array['ID_Budynku']);
        }
        if (isset($array['ID_Grupy'])) {
            $this->setIdGrupy($array['ID_Grupy']);
        }
        if (isset($array['ID_Wydzialu'])) {
            $this->setIdWydzialu($array['ID_Wydzialu']);
        }
        if (isset($array['Data'])) {
            $this->setData($array['Data']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM Zajecia';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $schedules = [];
        $result = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($result as $row) {
            $schedules[] = self::fromArray($row);
        }

        return $schedules;
    }

    public static function find($id): ?Schedule
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM Zajecia WHERE ID_Zajec = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        return self::fromArray($row);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO Zajecia (ID_Przedmiotu, Sala, Godzina_Startu, Godzina_Konca, ID_Wykladowcy, ID_Budynku, ID_Grupy, ID_Wydzialu, Data) 
                    VALUES (:idPrzedmiotu, :sala, :godzinaStartu, :godzinaKonca, :idWykladowcy, :idBudynku, :idGrupy, :idWydzialu, :data)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':idPrzedmiotu' => $this->getIdPrzedmiotu(),
                ':sala' => $this->getSala(),
                ':godzinaStartu' => $this->getGodzinaStartu(),
                ':godzinaKonca' => $this->getGodzinaKonca(),
                ':idWykladowcy' => $this->getIdWykladowcy(),
                ':idBudynku' => $this->getIdBudynku(),
                ':idGrupy' => $this->getIdGrupy(),
                ':idWydzialu' => $this->getIdWydzialu(),
                ':data' => $this->getData(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE Zajecia SET ID_Przedmiotu = :idPrzedmiotu, Sala = :sala, Godzina_Startu = :godzinaStartu, Godzina_Konca = :godzinaKonca,
                    ID_Wykladowcy = :idWykladowcy, ID_Budynku = :idBudynku, ID_Grupy = :idGrupy, ID_Wydzialu = :idWydzialu, Data = :data
                    WHERE ID_Zajec = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':idPrzedmiotu' => $this->getIdPrzedmiotu(),
                ':sala' => $this->getSala(),
                ':godzinaStartu' => $this->getGodzinaStartu(),
                ':godzinaKonca' => $this->getGodzinaKonca(),
                ':idWykladowcy' => $this->getIdWykladowcy(),
                ':idBudynku' => $this->getIdBudynku(),
                ':idGrupy' => $this->getIdGrupy(),
                ':idWydzialu' => $this->getIdWydzialu(),
                ':data' => $this->getData(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM Zajecia WHERE ID_Zajec = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setIdPrzedmiotu(null);
        $this->setSala(null);
        $this->setGodzinaStartu(null);
        $this->setGodzinaKonca(null);
        $this->setIdWykladowcy(null);
        $this->setIdBudynku(null);
        $this->setIdGrupy(null);
        $this->setIdWydzialu(null);
        $this->setData(null);
    }
}

<?php

namespace App\Model;

use App\Service\Config;

class Product
{
    private ?int $id = null;
    private ?string $name = null;
    private ?float $price = null;
    private ?string $manufacturer = null;
    private ?\DateTime $productionDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Product
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Product
    {
        $this->name = $name;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): Product
    {
        $this->price = $price;
        return $this;
    }

    public function getManufacturer(): ?string
    {
        return $this->manufacturer;
    }

    public function setManufacturer(?string $manufacturer): Product
    {
        $this->manufacturer = $manufacturer;
        return $this;
    }

    public function getProductionDate(): ?\DateTime
    {
        return $this->productionDate;
    }

    public function setProductionDate(?\DateTime $productionDate): Product
    {
        $this->productionDate = $productionDate;
        return $this;
    }

    public static function fromArray($array): Product
    {
        $product = new self();
        $product->fill($array);
        return $product;
    }

    public function fill($array): Product
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['price'])) {
            $this->setPrice($array['price']);
        }
        if (isset($array['manufacturer'])) {
            $this->setManufacturer($array['manufacturer']);
        }
        if (isset($array['production_date'])) {
            try {
                $this->setProductionDate(new \DateTime($array['production_date']));
            } catch (\Exception $e) {
                // Możesz dodać tutaj logowanie błędu
                $this->setProductionDate(null);
            }
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM products';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $products = [];
        $productsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($productsArray as $productArray) {
            $products[] = self::fromArray($productArray);
        }

        return $products;
    }

    public static function find($id): ?Product
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM products WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $productArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$productArray) {
            return null;
        }

        return self::fromArray($productArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO products (name, price, manufacturer, production_date) VALUES (:name, :price, :manufacturer, :production_date)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'price' => $this->getPrice(),
                'manufacturer' => $this->getManufacturer(),
                'production_date' => $this->getProductionDate() ? $this->getProductionDate()->format('Y-m-d') : null,
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE products SET name = :name, price = :price, manufacturer = :manufacturer, production_date = :production_date WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':price' => $this->getPrice(),
                ':manufacturer' => $this->getManufacturer(),
                ':production_date' => $this->getProductionDate() ? $this->getProductionDate()->format('Y-m-d') : null,
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM products WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setPrice(null);
        $this->setManufacturer(null);
        $this->setProductionDate(null);
    }
}
require_once 'ScheduleController.php';

$controller = new ScheduleController();

$result = $controller->fetchSchedule('teacher', 'Karczmarczyk Artur');

if ($result['success']) {
echo "Dane z API:\n";
print_r($result['data']);
} else {
echo "Błąd: " . $result['message'];
}
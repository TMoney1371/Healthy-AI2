<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$meals = \App\Models\Meal::select('id', 'name', 'photo_path')->limit(3)->get();
foreach ($meals as $meal) {
    echo "ID: {$meal->id}, Name: {$meal->name}, Photo: {$meal->photo_path}\n";
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

use App\Models\Questionaires;
use App\Models\SurgicalHistory;
use App\Models\Diagnosis;

class Clinic extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "clinics";
    protected $fillable = [
        'name',
        'short_name',
        'phone',
        'contact_no',
        'address',
        'address_2',
        'city',
        'state',
        'zip_code',
        'created_user'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}

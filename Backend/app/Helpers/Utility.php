<?php

namespace App\Helpers;

use App\Models\User;
use Auth;

class Utility
{
    public static function appendRoles(&$data)
    {
        if (Auth::user()->role == "1") {
            $data['created_user'] = Auth::id();
        } else {
            $user = User::with('clinicUser')->where('id', Auth::id())->first()->toArray();
    
            $data['clinic_id'] = $user['clinic_user']['clinic_id'];
            $data['created_user'] = Auth::id();
        }

        return $data;
    }
}

<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

use App\Models\User;
use App\Models\ClinicUser;
use Auth;

class ClinicScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        if (Auth::user()->role != "1") {
            // $userDetails = User::with('clinicUser')->where('id', Auth::id())->first()->toArray();
            $userDetails = Auth::user()->clinic_user;
            $clinicId = $userDetails['clinic_id'];
            $builder->where('clinic_id',$clinicId);
        }
    }
}

<?php

namespace App\Traits;

use IlluminateHttpRequest;

use App\Models\Scopes\ClinicScope;

/**
 * 
 */
trait HasClinicScope
{
    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new ClinicScope);
    }
}

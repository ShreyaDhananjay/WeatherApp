package com.example.weatherapi;

import java.io.Serializable;
import java.util.Objects;

public class Cities implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private int uid;
    private String city;
    private String country;

    public Cities() {
    }

    public Cities(int uid, String city, String country) {
        this.uid = uid;
        this.city = city;
        this.country = country;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cities cities = (Cities) o;
        return uid == cities.uid && city.equals(cities.city) &&
                country.equals(cities.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(city, country);
    }   
}
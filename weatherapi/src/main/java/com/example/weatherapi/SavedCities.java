package com.example.weatherapi;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "saved_cities")
@IdClass(Cities.class)
public class SavedCities implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    @Id
    private int uid;
    @Id
    private String city;
    @Id
    private String country;
    
    public SavedCities(){

    }
    public SavedCities(int uid, String city, String country){
        this.uid = uid;
        this.city = city;
        this.country = country;
    }
    public int getUid(){
        return this.uid;
    }
    public void setUid(int uid){
        this.uid = uid;
    }
    public String getCity(){
        return this.city;
    }
    public void setCity(String city){
        this.city = city;  
    }
    public String getCountry(){
        return this.country;
    }
    public void setcCuntry(String country){
        this.country = country;  
    }
}
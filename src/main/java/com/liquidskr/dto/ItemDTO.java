package com.liquidskr.dto;

public class ItemDTO {
    private String name;           // 아이템 이름
    private String type;           // 아이템 종류 (예: 상의, 하의 등)
    private String description;    // 아이템 설명

    // 기본 생성자
    public ItemDTO() {
    }

    // 생성자 (이름과 종류 포함)
    public ItemDTO(String name, String type) {
        this.name = name;
        this.type = type;
    }

    // 전체 필드를 포함한 생성자
    public ItemDTO(String name, String type, String description) {
        this.name = name;
        this.type = type;
        this.description = description;
    }

    // Getter와 Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "ItemDTO{" +
                "name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}

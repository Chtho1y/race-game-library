import * as THREE from 'three';

class Car {
    constructor(color = 0xffffff) { // 默认颜色为白色
        this.mesh = new THREE.Group();

        // 创建车身
        const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.25; // 确保车身不会嵌入地面
        this.mesh.add(body);

        // 创建车顶
        const roofGeometry = new THREE.BoxGeometry(0.8, 0.3, 1.2);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: color });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 0.65; // 车顶位于车身上方
        this.mesh.add(roof);

        // 创建车轮
        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

        const wheelPositions = [
            [-0.5, 0, -0.9],
            [0.5, 0, -0.9],
            [-0.5, 0, 0.9],
            [0.5, 0, 0.9]
        ];

        for (const pos of wheelPositions) {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], pos[1], pos[2]);
            this.mesh.add(wheel);
        }
    }

    moveForward(distance) {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.mesh.quaternion);
        this.mesh.position.addScaledVector(direction, distance);
    }

    turn(angle) {
        this.mesh.rotation.y += angle;
    }
}

export { Car };

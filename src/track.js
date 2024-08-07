// 定义赛道路段和树木的基本结构。
import * as THREE from 'three';

class Track {
    constructor() {
        this.mesh = new THREE.Group();

        // 创建赛道
        const roadGeometry = new THREE.PlaneGeometry(10, 2000);
        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        this.mesh.add(road);

        // 创建红白间隔的警戒线
        this.createWarningLines();
    }

    createWarningLines() {
        const lineWidth = 0.5;
        const lineHeight = 0.1;
        const segmentLength = 1;

        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

        for (let i = -1000; i < 1000; i += segmentLength * 2) {
            const redSegmentLeft = new THREE.Mesh(new THREE.BoxGeometry(lineWidth, lineHeight, segmentLength), redMaterial);
            redSegmentLeft.position.set(-5 - lineWidth / 2, lineHeight / 2, i);
            this.mesh.add(redSegmentLeft);

            const whiteSegmentLeft = new THREE.Mesh(new THREE.BoxGeometry(lineWidth, lineHeight, segmentLength), whiteMaterial);
            whiteSegmentLeft.position.set(-5 - lineWidth / 2, lineHeight / 2, i + segmentLength);
            this.mesh.add(whiteSegmentLeft);

            const redSegmentRight = new THREE.Mesh(new THREE.BoxGeometry(lineWidth, lineHeight, segmentLength), redMaterial);
            redSegmentRight.position.set(5 + lineWidth / 2, lineHeight / 2, i);
            this.mesh.add(redSegmentRight);

            const whiteSegmentRight = new THREE.Mesh(new THREE.BoxGeometry(lineWidth, lineHeight, segmentLength), whiteMaterial);
            whiteSegmentRight.position.set(5 + lineWidth / 2, lineHeight / 2, i + segmentLength);
            this.mesh.add(whiteSegmentRight);
        }
    }

    moveBackward(distance) {
        this.mesh.position.z += distance;
    }
}

export { Track };

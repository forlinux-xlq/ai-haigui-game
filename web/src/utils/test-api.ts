import { askAI } from './api.js';
import type { TStory } from '../types';

// 测试故事
const testStory: TStory = {
  id: 'test',
  title: '测试故事',
  difficulty: 'easy',
  surface: '一个男人在浴室里死了，地上有碎玻璃和一片水渍。',
  bottom: '男人是花样滑冰运动员，在冰面上表演后去浴室。地上的是冰碎，不是玻璃。',
  hintCount: 3
};

// 测试问题
const testQuestions = [
  '男人是因为滑倒才死的吗？',
  '地上的是冰碎吗？',
  '浴室里有其他人吗？'
];

// 测试函数
async function testAPI() {
  console.log('开始测试 SiliconFlow API...');
  
  for (const question of testQuestions) {
    console.log(`\n测试问题: ${question}`);
    try {
      const answer = await askAI(question, testStory);
      console.log(`AI 回答: ${answer}`);
    } catch (error) {
      console.error(`测试失败: ${error}`);
    }
  }
  
  console.log('\n测试完成！');
}

// 运行测试
testAPI();
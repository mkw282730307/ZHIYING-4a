// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, UploadCloud, Image as ImageIcon } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Textarea, useToast } from '@/components/ui';

export default function UploadPage(props) {
  const {
    $w
  } = props;
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    character: '',
    series: ''
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const {
    toast
  } = useToast();

  // 处理图片选择
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setImagePreview(event.target.result);
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "请输入商品名称",
        variant: "destructive"
      });
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      toast({
        title: "请输入有效价格",
        variant: "destructive"
      });
      return;
    }
    if (!formData.image) {
      toast({
        title: "请上传商品图片",
        variant: "destructive"
      });
      return;
    }
    try {
      setUploading(true);
      await $w.cloud.callDataSource({
        dataSourceName: 'anime_goods',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            image: formData.image,
            category: formData.category,
            character: formData.character,
            series: formData.series,
            ownerId: $w.auth.currentUser.userId,
            createdAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: "上传成功",
        description: "商品已成功发布"
      });

      // 返回上一页
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('上传失败:', error);
      toast({
        title: "上传失败",
        description: "无法发布商品",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold ml-4">上传谷子</h1>
        </div>
      </div>

      {/* 上传表单 */}
      <div className="p-4 space-y-6">
        {/* 图片上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">商品图片</label>
          <div className="relative">
            {imagePreview ? <div className="relative">
                <img src={imagePreview} alt="预览" className="w-full h-48 object-cover rounded-lg" />
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-white" />
                </label>
              </div> : <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">点击上传图片</span>
              </label>}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* 商品名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">商品名称</label>
          <Input value={formData.name} onChange={e => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))} placeholder="请输入商品名称" maxLength={50} />
        </div>

        {/* 价格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">价格</label>
          <Input type="number" value={formData.price} onChange={e => setFormData(prev => ({
          ...prev,
          price: e.target.value
        }))} placeholder="请输入价格" min="0" step="0.01" />
        </div>

        {/* 系列 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">所属系列</label>
          <Input value={formData.series} onChange={e => setFormData(prev => ({
          ...prev,
          series: e.target.value
        }))} placeholder="请输入所属系列" maxLength={50} />
        </div>

        {/* 角色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">角色名称</label>
          <Input value={formData.character} onChange={e => setFormData(prev => ({
          ...prev,
          character: e.target.value
        }))} placeholder="请输入角色名称" maxLength={50} />
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
          <Input value={formData.category} onChange={e => setFormData(prev => ({
          ...prev,
          category: e.target.value
        }))} placeholder="请输入分类" maxLength={30} />
        </div>

        {/* 商品描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">商品描述</label>
          <Textarea value={formData.description} onChange={e => setFormData(prev => ({
          ...prev,
          description: e.target.value
        }))} placeholder="请输入商品描述" rows={4} maxLength={500} />
        </div>

        {/* 上传按钮 */}
        <Button onClick={handleSubmit} disabled={uploading} className="w-full">
          {uploading ? '上传中...' : '发布商品'}
        </Button>
      </div>
    </div>;
}
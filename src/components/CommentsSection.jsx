// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { MessageCircle } from 'lucide-react';
// @ts-ignore;
import { Button, Textarea } from '@/components/ui';

export function CommentsSection({
  comments,
  comment,
  onCommentChange,
  onSubmit,
  submitting
}) {
  return <div>
      <h3 className="font-medium mb-3 flex items-center">
        <MessageCircle className="w-4 h-4 mr-1" />
        短评 ({comments.length})
      </h3>
      <div className="space-y-3">
        {comments.map(c => <div key={c._id} className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-800">{c.content}</p>
            <p className="text-xs text-gray-500 mt-2">by {c.userName || '匿名用户'}</p>
          </div>)}
        {comments.length === 0 && <div className="text-center py-8 text-gray-500">
            <p>暂无评论</p>
            <p className="text-sm">成为第一个评论的人吧</p>
          </div>}
      </div>
      <div className="mt-4">
        <Textarea placeholder="写下你的短评..." value={comment} onChange={onCommentChange} className="mb-3 border-pink-200 focus:border-pink-400" rows={3} maxLength={200} />
        <Button onClick={onSubmit} className="w-full" disabled={submitting}>
          {submitting ? '发表中...' : '发表评论'}
        </Button>
      </div>
    </div>;
}